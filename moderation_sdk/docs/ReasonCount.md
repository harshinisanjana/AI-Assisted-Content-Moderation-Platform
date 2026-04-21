# ReasonCount


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reason** | **str** |  | 
**count** | **int** |  | 

## Example

```python
from moderation_sdk.models.reason_count import ReasonCount

# TODO update the JSON string below
json = "{}"
# create an instance of ReasonCount from a JSON string
reason_count_instance = ReasonCount.from_json(json)
# print the JSON string representation of the object
print(ReasonCount.to_json())

# convert the object into a dict
reason_count_dict = reason_count_instance.to_dict()
# create an instance of ReasonCount from a dict
reason_count_from_dict = ReasonCount.from_dict(reason_count_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


