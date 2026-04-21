# moderation_sdk.PostsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_post_posts_post**](PostsApi.md#create_post_posts_post) | **POST** /posts/ | Create Post
[**get_post_posts_post_id_get**](PostsApi.md#get_post_posts_post_id_get) | **GET** /posts/{post_id} | Get Post
[**get_post_stats_posts_stats_get**](PostsApi.md#get_post_stats_posts_stats_get) | **GET** /posts/stats | Get Post Stats
[**list_posts_posts_get**](PostsApi.md#list_posts_posts_get) | **GET** /posts/ | List Posts
[**publish_post_posts_post_id_publish_patch**](PostsApi.md#publish_post_posts_post_id_publish_patch) | **PATCH** /posts/{post_id}/publish/ | Publish Post
[**submit_post_for_review_posts_post_id_submit_post**](PostsApi.md#submit_post_for_review_posts_post_id_submit_post) | **POST** /posts/{post_id}/submit/ | Submit Post For Review


# **create_post_posts_post**
> PostRead create_post_posts_post(post_create)

Create Post

### Example


```python
import moderation_sdk
from moderation_sdk.models.post_create import PostCreate
from moderation_sdk.models.post_read import PostRead
from moderation_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = moderation_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with moderation_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = moderation_sdk.PostsApi(api_client)
    post_create = moderation_sdk.PostCreate() # PostCreate | 

    try:
        # Create Post
        api_response = api_instance.create_post_posts_post(post_create)
        print("The response of PostsApi->create_post_posts_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PostsApi->create_post_posts_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_create** | [**PostCreate**](PostCreate.md)|  | 

### Return type

[**PostRead**](PostRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_post_posts_post_id_get**
> PostRead get_post_posts_post_id_get(post_id)

Get Post

### Example


```python
import moderation_sdk
from moderation_sdk.models.post_read import PostRead
from moderation_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = moderation_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with moderation_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = moderation_sdk.PostsApi(api_client)
    post_id = 56 # int | 

    try:
        # Get Post
        api_response = api_instance.get_post_posts_post_id_get(post_id)
        print("The response of PostsApi->get_post_posts_post_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PostsApi->get_post_posts_post_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_id** | **int**|  | 

### Return type

[**PostRead**](PostRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_post_stats_posts_stats_get**
> StatsResponse get_post_stats_posts_stats_get()

Get Post Stats

Return aggregated statistics for the analytics dashboard.

### Example


```python
import moderation_sdk
from moderation_sdk.models.stats_response import StatsResponse
from moderation_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = moderation_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with moderation_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = moderation_sdk.PostsApi(api_client)

    try:
        # Get Post Stats
        api_response = api_instance.get_post_stats_posts_stats_get()
        print("The response of PostsApi->get_post_stats_posts_stats_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PostsApi->get_post_stats_posts_stats_get: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**StatsResponse**](StatsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_posts_posts_get**
> List[PostRead] list_posts_posts_get(skip=skip, limit=limit, status=status)

List Posts

### Example


```python
import moderation_sdk
from moderation_sdk.models.post_read import PostRead
from moderation_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = moderation_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with moderation_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = moderation_sdk.PostsApi(api_client)
    skip = 0 # int |  (optional) (default to 0)
    limit = 20 # int |  (optional) (default to 20)
    status = moderation_sdk.PostStatus() # PostStatus |  (optional)

    try:
        # List Posts
        api_response = api_instance.list_posts_posts_get(skip=skip, limit=limit, status=status)
        print("The response of PostsApi->list_posts_posts_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PostsApi->list_posts_posts_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **skip** | **int**|  | [optional] [default to 0]
 **limit** | **int**|  | [optional] [default to 20]
 **status** | [**PostStatus**](.md)|  | [optional] 

### Return type

[**List[PostRead]**](PostRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **publish_post_posts_post_id_publish_patch**
> PostRead publish_post_posts_post_id_publish_patch(post_id)

Publish Post

### Example


```python
import moderation_sdk
from moderation_sdk.models.post_read import PostRead
from moderation_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = moderation_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with moderation_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = moderation_sdk.PostsApi(api_client)
    post_id = 56 # int | 

    try:
        # Publish Post
        api_response = api_instance.publish_post_posts_post_id_publish_patch(post_id)
        print("The response of PostsApi->publish_post_posts_post_id_publish_patch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PostsApi->publish_post_posts_post_id_publish_patch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_id** | **int**|  | 

### Return type

[**PostRead**](PostRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **submit_post_for_review_posts_post_id_submit_post**
> ReviewResponse submit_post_for_review_posts_post_id_submit_post(post_id)

Submit Post For Review

### Example


```python
import moderation_sdk
from moderation_sdk.models.review_response import ReviewResponse
from moderation_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = moderation_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with moderation_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = moderation_sdk.PostsApi(api_client)
    post_id = 56 # int | 

    try:
        # Submit Post For Review
        api_response = api_instance.submit_post_for_review_posts_post_id_submit_post(post_id)
        print("The response of PostsApi->submit_post_for_review_posts_post_id_submit_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PostsApi->submit_post_for_review_posts_post_id_submit_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_id** | **int**|  | 

### Return type

[**ReviewResponse**](ReviewResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

