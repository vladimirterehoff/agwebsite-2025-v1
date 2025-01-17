const queryString = require('query-string');
import {FILTER_DEFAULTS} from './constants';
import {FilterBuilder} from './filterBuilder';

interface Scope {
  name : string,
  parameters : any
}

export class FilterService {
  /**
   * Variable stores keys for search
   * 'name|email'
   * @type {string}
   */
  _searchFields: string  = '';
  _limit: string|number  = FILTER_DEFAULTS.LIMIT_ON_PAGE;
  _page: string|number   = 1;
  _search: string        = '';
  _sort: string          = FILTER_DEFAULTS.DEFAULT_SORT;
  _sortExpand: string|null    = null;
  _default_sort: string|null  = null;
  _expand: string        = '';
  _filterBuilder: string =  '';
  _filterExpand : string = '';
  _scope   : Scope[]      = [];
  _where   : any      = {};
  _params   : any      = [];

  builder: any;

  /**
   * @param searchFields:string[]  - array with key for search
   */
  constructor(searchFields = ['']) {
    this.transformSearchFields(searchFields);
    this.builder = new FilterBuilder();
  }

  /**
   *
   * @param fields : string[]
   */
  transformSearchFields(fields: string[]) {
    this._searchFields = fields.join('|');
  }

  /**
   *
   * @param expand : string[]
   */
  transformExpands(expand : string[]) {
    this._expand = expand.join(',');
  }

  /**
   *
   * @returns {HttpParams}
   */
  getFilterParams() {
    let filterParams:any = {};

    if(this._expand) {
      filterParams['expand'] = this._expand.toString();
    }

    if(this._page) {
      filterParams['page'] = this._page.toString();
    }

    if(this._params) {
      this._params.forEach((e:any)=>{
        filterParams[e.key] = e.value;
      })
    }

    if(this._limit) {
      filterParams['limit'] = this._limit.toString();
    }

    if(this._scope.length) {
      filterParams['scopes'] = JSON.stringify(this._scope);
    }

    if(this._sort) {
      if(this._sort == 'default' && this._default_sort) {
        this._sort = this._default_sort;
      }

      filterParams['sort'] = this._sort.toString();
    }

    if(this._sortExpand) {
      filterParams['sortExpand'] = this._sortExpand.toString();
    }

    if(this._search) {
      let query =this._search;

      filterParams['search'] = JSON.stringify({
        query  : query,
        fields : this._searchFields
      });
    }

    if(this._filterBuilder) {
      filterParams['filter'] = this._filterBuilder;
    }
    else{
      filterParams['filter'] = this.builder.toString()
    }

    if(this._filterExpand) {
      filterParams['filterExpand'] = this._filterExpand;
    }

    if(this._filterExpand) {
      filterParams['filterExpand'] = this._filterExpand;
    }

    return queryString.stringify(filterParams, {
      skipNull: true
    });
  }

  /**
   *
   * @param searchFields : string[]
   */
  searchItems(searchFields = ['']) {
    this.transformSearchFields(searchFields);
  }

  /**
   *
   * @param search : string
   */
  search(search: string) {
    this._search = search;
  }

  /**
   *
   * @param params : Object (key, value)
   */
  params(data: {key : string, value : string | number}[]) {
    this._params = data;
  }

  /**
   *
   * @param page : string|number
   */
  page(page: number) {
    this._page = page;
  }

  /**
   *
   * @param limit : string|number
   */
  limit(limit: number) {
    this._limit = limit;
  }

  /**
   *
   * @param sortParam : string
   * @param defaultSort : string
   */
  sort(sortParam: string, defaultSort = null) {
    this._sort         = sortParam;
    this._default_sort = defaultSort;
  }

  /**
   *
   * @param sortParam : string
   */
  sortExpand (sortParam: string) {
    this._sortExpand    = sortParam;
  }

  /**
   *
   * @param expand : string[]
   */
  expand(expand: string[]) {
    this.transformExpands(expand);
  }

  /**
   *
   * @param filter: string
   */
  filterBuilder(filter: string){
    this._filterBuilder = filter;
  }

  /**
   *
   * @param filter: string
   */
  filterExpand(filter: string){
    this._filterExpand = filter;
  }

  /**
   *
   * @param newScope: Scope
   */
  scope(newScope: Scope | any) {
    let isSet  = false;
    this._scope.forEach((e, index)=>{
      if(e.name==newScope.name) {
        e.parameters = newScope.parameters;
        isSet = true;
      }
    })
    if(!isSet)this._scope.push(newScope);
  }

  clearScope(scopeParam? : string){
    if(scopeParam){
      this._scope.forEach((e, index)=>{
        if(e.name==scopeParam) this._scope.splice(index,1);
      })
    }
    else  this._scope=[];
  }

  /**
   * Returns filter data
   * @returns {HttpParams}
   */
  get filter() {
    return this.getFilterParams();
  }
}
