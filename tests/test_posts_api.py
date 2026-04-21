from fastapi.testclient import TestClient


def create_draft(
    client: TestClient,
    title: str = "Draft Post",
    content: str = "This is a neutral and polite post with enough length to be reviewed safely.",
) -> dict:
    response = client.post(
        "/posts/",
        json={
            "title": title,
            "content": content,
        },
    )
    assert response.status_code == 201
    return response.json()


def test_create_and_get_post_starts_as_draft(client: TestClient) -> None:
    created = create_draft(client)

    assert created["status"] == "draft"
    assert created["flagged_reasons"] == []

    response = client.get(f"/posts/{created['id']}")
    assert response.status_code == 200

    payload = response.json()
    assert payload["title"] == "Draft Post"
    assert payload["status"] == "draft"
    assert payload["flagged_reasons"] == []


def test_short_all_caps_post_is_flagged_on_submit(client: TestClient) -> None:
    created = create_draft(client, content="THIS IS UNACCEPTABLE!!!")

    response = client.post(f"/posts/{created['id']}/submit/")
    assert response.status_code == 200

    payload = response.json()
    assert payload["status"] == "flagged"
    reasons = " ".join(payload["flagged_reasons"]).lower()
    assert "too short" in reasons
    assert "all caps" in reasons


def test_profanity_is_flagged_on_submit(client: TestClient) -> None:
    profanity_content = (
        "I appreciate debate, but calling people idiot during discussion crosses the line "
        "and this sentence is intentionally long enough for moderation length checks."
    )
    created = create_draft(client, content=profanity_content)

    response = client.post(f"/posts/{created['id']}/submit/")
    assert response.status_code == 200

    payload = response.json()
    assert payload["status"] == "flagged"
    reasons = " ".join(payload["flagged_reasons"]).lower()
    assert "banned words detected" in reasons
    assert "idiot" in reasons


def test_submit_polite_post_is_approved(client: TestClient) -> None:
    approved_content = (
        "Thank you for reading this update. "
        "The team completed the iteration and documented outcomes clearly. "
        "We appreciate the thoughtful feedback from everyone involved."
    )
    created = create_draft(client, content=approved_content)
    assert created["status"] == "draft"

    response = client.post(f"/posts/{created['id']}/submit/")
    assert response.status_code == 200

    payload = response.json()
    assert payload["status"] == "approved"
    assert payload["flagged_reasons"] == []


def test_publish_requires_approved_status(client: TestClient) -> None:
    created = create_draft(client)
    assert created["status"] == "draft"

    response = client.patch(f"/posts/{created['id']}/publish/")
    assert response.status_code == 400
    assert response.json()["detail"] == "Only approved posts can be published."


def test_publish_after_approval_and_lock_content(client: TestClient) -> None:
    approved_content = (
        "This article explains the release process in a clear and polite way, "
        "with practical details and enough context to satisfy the review requirements."
    )
    created = create_draft(client, content=approved_content)
    assert created["status"] == "draft"

    submit_response = client.post(f"/posts/{created['id']}/submit/")
    assert submit_response.status_code == 200
    assert submit_response.json()["status"] == "approved"

    publish_response = client.patch(f"/posts/{created['id']}/publish/")
    assert publish_response.status_code == 200
    assert publish_response.json()["status"] == "published"
    assert publish_response.json()["published_at"] is not None

    locked_submit = client.post(f"/posts/{created['id']}/submit/")
    assert locked_submit.status_code == 409
    assert "immutable" in locked_submit.json()["detail"].lower()


def test_list_posts_with_status_filter(client: TestClient) -> None:
    approved_candidate = create_draft(
        client,
        title="Approved Candidate",
        content=(
            "A balanced article with clear language and enough detail to pass moderation "
            "for approval on submission."
        ),
    )
    flagged_candidate = create_draft(client, title="Flagged Candidate", content="BAD WORDS!!!")
    draft_candidate = create_draft(
        client,
        title="Still Draft",
        content="This one stays as draft because it has not been submitted for review yet.",
    )

    assert approved_candidate["status"] == "draft"
    assert flagged_candidate["status"] == "draft"
    assert draft_candidate["status"] == "draft"

    approved_submit = client.post(f"/posts/{approved_candidate['id']}/submit/")
    assert approved_submit.status_code == 200
    assert approved_submit.json()["status"] == "approved"

    flagged_submit = client.post(f"/posts/{flagged_candidate['id']}/submit/")
    assert flagged_submit.status_code == 200
    assert flagged_submit.json()["status"] == "flagged"

    approved_response = client.get("/posts/", params={"status": "approved"})
    assert approved_response.status_code == 200
    approved_posts = approved_response.json()
    assert len(approved_posts) == 1
    assert approved_posts[0]["title"] == "Approved Candidate"

    flagged_response = client.get("/posts/", params={"status": "flagged"})
    assert flagged_response.status_code == 200
    flagged_posts = flagged_response.json()
    assert len(flagged_posts) == 1
    assert flagged_posts[0]["title"] == "Flagged Candidate"

    draft_response = client.get("/posts/", params={"status": "draft"})
    assert draft_response.status_code == 200
    draft_posts = draft_response.json()
    assert len(draft_posts) == 1
    assert draft_posts[0]["title"] == "Still Draft"


def test_stats_endpoint(client: TestClient) -> None:
    """GET /posts/stats returns analytics data."""
    approved_content = (
        "A well-written polite post that meets the minimum length requirement "
        "and should pass moderation without any issues at all."
    )
    approved_draft = create_draft(client, title="Post A", content=approved_content)
    flagged_draft = create_draft(client, title="Post B", content="TOO SHORT!!!")
    create_draft(
        client,
        title="Post C",
        content="This remains a draft post with enough neutral content to avoid immediate issues.",
    )

    client.post(f"/posts/{approved_draft['id']}/submit/")
    client.post(f"/posts/{flagged_draft['id']}/submit/")

    response = client.get("/posts/stats")
    assert response.status_code == 200

    stats = response.json()
    assert stats["total_posts"] == 3
    assert len(stats["status_distribution"]) == 4
    assert len(stats["timeline"]) == 30
    assert isinstance(stats["approval_rate"], float)
    assert isinstance(stats["flag_rate"], float)

