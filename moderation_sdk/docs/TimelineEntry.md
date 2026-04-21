# TimelineEntry


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_date** | **str** |  | 
**count** | **int** |  | 

## Example

```python
from moderation_sdk.models.timeline_entry import TimelineEntry

# TODO update the JSON string below
json = "{}"
# create an instance of TimelineEntry from a JSON string
timeline_entry_instance = TimelineEntry.from_json(json)
# print the JSON string representation of the object
print(TimelineEntry.to_json())

# convert the object into a dict
timeline_entry_dict = timeline_entry_instance.to_dict()
# create an instance of TimelineEntry from a dict
timeline_entry_from_dict = TimelineEntry.from_dict(timeline_entry_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


