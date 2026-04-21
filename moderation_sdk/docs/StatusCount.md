# StatusCount


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | 
**count** | **int** |  | 

## Example

```python
from moderation_sdk.models.status_count import StatusCount

# TODO update the JSON string below
json = "{}"
# create an instance of StatusCount from a JSON string
status_count_instance = StatusCount.from_json(json)
# print the JSON string representation of the object
print(StatusCount.to_json())

# convert the object into a dict
status_count_dict = status_count_instance.to_dict()
# create an instance of StatusCount from a dict
status_count_from_dict = StatusCount.from_dict(status_count_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


