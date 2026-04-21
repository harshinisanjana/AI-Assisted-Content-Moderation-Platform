# StatsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status_distribution** | [**List[StatusCount]**](StatusCount.md) |  | 
**timeline** | [**List[TimelineEntry]**](TimelineEntry.md) |  | 
**top_flagged_reasons** | [**List[ReasonCount]**](ReasonCount.md) |  | 
**total_posts** | **int** |  | 
**approval_rate** | **float** |  | 
**flag_rate** | **float** |  | 

## Example

```python
from moderation_sdk.models.stats_response import StatsResponse

# TODO update the JSON string below
json = "{}"
# create an instance of StatsResponse from a JSON string
stats_response_instance = StatsResponse.from_json(json)
# print the JSON string representation of the object
print(StatsResponse.to_json())

# convert the object into a dict
stats_response_dict = stats_response_instance.to_dict()
# create an instance of StatsResponse from a dict
stats_response_from_dict = StatsResponse.from_dict(stats_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


