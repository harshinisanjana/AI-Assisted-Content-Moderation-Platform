# PostCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **str** |  | 
**content** | **str** |  | 

## Example

```python
from moderation_sdk.models.post_create import PostCreate

# TODO update the JSON string below
json = "{}"
# create an instance of PostCreate from a JSON string
post_create_instance = PostCreate.from_json(json)
# print the JSON string representation of the object
print(PostCreate.to_json())

# convert the object into a dict
post_create_dict = post_create_instance.to_dict()
# create an instance of PostCreate from a dict
post_create_from_dict = PostCreate.from_dict(post_create_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


