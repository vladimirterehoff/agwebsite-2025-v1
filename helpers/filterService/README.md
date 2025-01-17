Backend: https://git.attractgroup.com/amondar/sextant/-/tree/1.2.10

#### Initialization
const  filter = new FilterService();

#### Set Params:
##### Page
filter.page(1);

##### Limit
filter.limit(20);

##### Sort
filter.sort('name'); 
filter.sort('-name');

##### Search
filter.searchItems(['email, 'name']);
filter.search('soem search text');

##### Expand
filter.expand(['some_expand1', 'some_expand2']);
filter.sortExpand('name');
filter.filterExpand('filter_string');

##### Scope
filter.scope({name:"doesntHavePermission", parameters:[["sign-in"]]});
filter.clearScope("doesntHavePermission");
filter.clearScope();

#### Set filter string
##### Equal
filter.builder.equal(key: string, value: any);

##### like
filter.builder.like(key: string, value: string | number);

##### not
filter.builder.not(key: string, value: string | number);

##### greater (>)
filter.builder.greater(key: string, value: string | number);

##### greaterOrEqual (>=)
filter.builder.greaterOrEqual(key: string, value: string | number);

##### less (<)
filter.builder.less(key: string, value: string | number);

##### lessOrEqual (<=)
filter.builder.lessOrEqual(key: string, value: string | number);

##### fromTo 
filter.builder.fromTo(key: string, valueFrom: string | number, valueTo: string | number);

##### to 
filter.builder.to(key: string, value: string | number);

##### in 
filter.builder.in(key: string, value: any[]);

##### notIn 
filter.builder.notIn(key: string, value: any[]);

##### isNull 
filter.builder.isNull(key: string);

##### isNotNull 
filter.builder.isNotNull(key: string);

##### Remove some filter
filter.builder.remove('organization.id');

##### Reset all filters
filter.builder.reset();


#### Create rezult filter string
filter.filter
actions.get(id,filter.filter);