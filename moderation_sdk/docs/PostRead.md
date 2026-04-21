# PostRead


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**title** | **str** |  | 
**content** | **str** |  | 
**status** | [**PostStatus**](PostStatus.md) |  | 
**flagged_reasons** | **List[str]** |  | [optional] 
**created_at** | **datetime** |  | 
**published_at** | **datetime** |  | [optional] 

## Example

```python
from moderation_sdk.models.post_read import PostRead

# TODO update the JSON string below
json = "{}"
# create an instance of PostRead from a JSON string
post_read_instance = PostRead.from_json(json)
# print the JSON string representation of the object
print(PostRead.to_json())

# convert the object into a dict
post_read_dict = post_read_instance.to_dict()
# create an instance of PostRead from a dict
post_read_from_dict = PostRead.from_dict(post_read_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


