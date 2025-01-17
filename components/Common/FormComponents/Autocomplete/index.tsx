// Libs
import React, {useState, ChangeEvent, ReactNode, useRef, useEffect} from 'react';
import {useFormContext, useWatch} from "react-hook-form";
// Services
import api from "@/services/axios";
// MUI Components
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import FormHelperText from "@mui/material/FormHelperText";
import CloseIcon from "@mui/icons-material/Close";
// Helpers
import {FilterService} from "@/helpers/filterService";
// Styles
import styles from './style.module.scss'
import {isObject} from "chart.js/helpers";

interface SearchParams {
  url: string
  searchBy?: string[]
  limit?: number
  searchByScopeName?: string
  exclude?: Array<string|number|boolean|null|Array<string|number|boolean|undefined|null>>
  simpleSearchParam?: boolean
  equal?: Array<string|number|boolean|null|Array<string|number|boolean|undefined|null>>
  expand?: string[]
  extraParams?: string;
}

interface AutocompleteProps {
  name: string
  searchParams: SearchParams
  defaultValue?: any
  label?: string
  onChange?: (val: any | null, object?: any) => void
  labelName?: string
  variant?: 'filled' | 'outlined' | 'standard'
  size?: 'small' | 'medium'
  error?: boolean
  helperText?: any
  multilang?: boolean
  clearValidation?: () => void
  getName?: (option: any) => string
  required?: boolean
  disabled?: boolean
}

/**
 * Autocomplete Component
 * @param props
 * @constructor
 */
const Autocomplete = (props : AutocompleteProps) => {
  const {
    name,
    searchParams,
    defaultValue,
    size,
    variant = 'outlined',
    label = 'Select option',
    labelName = 'name',
    multilang = false,
    required,
    disabled
  } = props;

  const {
    url,
    searchByScopeName,
    limit = 20,
    searchBy = ['name'],
    exclude,
    simpleSearchParam = false,
    equal,
    expand
  } = searchParams

  const { setValue: setFormValue, watch } = useFormContext();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState<any>(null);
  const [search, setSearch] = useState<string>('');
  const [filter] = useState(new FilterService());
  const anchorEl = useRef(null);

  useEffect(()=>{
    setValue(watch(name))
  }, [watch(name)])

  useEffect(()=> {
    if (isObject(defaultValue)) {
      setValue({
        [labelName]: defaultValue.name
      });
    } else {
      setValue({
        [labelName]: defaultValue
      });
    }

  }, [])

  /**
   * Get List
   */
  const getList = async () => {
    setLoading(true);
    filter.builder.reset();
    if(!simpleSearchParam) filter.searchItems([...searchBy]);
    filter.limit(limit);

    //set equal rules
    if(exclude) {
      if(Array.isArray(exclude?.[0])) {
        exclude?.forEach((item: any) => {
          filter.builder.notIn(...item);
        }) 
      } else {
        filter.builder.notIn(...exclude);
      }
    }

    //set expand rules
    if(expand?.length) filter.expand(expand);
    
    //set equal rules
    if(equal) {
      if(Array.isArray(equal?.[0])) {
        equal?.forEach((item: any) => {
          filter.builder.equal(...item);
        }) 
      } else {
        filter.builder.equal(...equal);
      }
    }

    try {
      const response = await api.get(`${url}?${filter.filter}`);
      const data = response.data;
      const options = data;
      setOptions(options);
      setOpen(true);
      setLoading(false);
    } catch (e) {
      console.error(e, 'error')
      setLoading(false);
    }
  };

  /**
   * Handle Search Change
   * @param event
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if(props.clearValidation) props.clearValidation();
    event.persist();
    setSearch(event.target.value);
    setValue({
      [labelName]: event.target.value
    });
  };

  /**
   * Search Action
   */
  useEffect(() => {
    if (search) {
      searchAction()
    }
  }, [search]);

  const searchAction = async () => {
    if (search?.length < 1) {
      setOptions([]);
      return
    }

    searchByScopeName ?
        filter.scope({ "name": searchByScopeName, "parameters": [search] }) :
        simpleSearchParam ? filter.params([{key:'search', value: search}]) :
            filter.search(search);

    await getList();
  };

  /**
   * Select Option from Dropdown
   * @param e
   */
  const selectOption = (item: any) => () => {
    setOptions([]);
    setOpen(false);
    if(props.onChange) props.onChange(item);
    setFormValue(name, multilang ? {...item, [labelName]: getOptionName(item)} : item);
  }

  /**
   * Clear text field
   */
  const clearOption = () => {
    setSearch('');
    setOptions([]);
    setOpen(false);
    if(props.onChange) props.onChange(null);
    setFormValue(name, null);
    setValue('');
  };

  /**
   * Blur callback
   */
  const handleBlur = () => {
    if(open) {
      setTimeout(()=>{
        setOpen(false);
      },0);
    }
  }

  /**
   * Focus callback
   */
  const handleFocus = () => {
    if(value && value.label != search) setSearch(value[labelName]);
    setOpen(true)
  }


  /**
   * Get option name callback
   */
  const getOptionName = (item: any) => {
    let childNode;
    if (props.getName) {
      childNode = props.getName(item);
    } else {
      childNode = multilang ? item[labelName].en : item[labelName]
    }

    return childNode;
  }

  /**
   * Render dropdown
   */
  const renderDropdown = () => {
    if (loading) {
      return <span className={styles.placeholderText}>Loading...</span>
    }
    if (!loading && !options.length) {
      return <span className={styles.placeholderText}>Not found</span>
    }
    if (!loading && options.length) {
      return (
          <ul className={`${styles.autocompleteList}`}>
            {options.map((item, idx) => {
              return (
                  <li
                      key={`${item}__${idx}`}
                      className={`${styles.autocompleteList_item}`}
                      onClick={selectOption(item)}
                      onMouseDown={(e: any) => e.preventDefault()}
                  >
                    <span>{getOptionName(item)}</span>
                  </li>
              )
            })}
          </ul>
      )
    }
  }

  return (
      <div className={styles.autocompleteContainer}>
        <TextField
            ref={anchorEl}
            fullWidth={true}
            variant={variant}
            size={size}
            onChange={handleSearchChange}
            value={value? value[labelName] : ''}
            onBlur={handleBlur}
            onFocus={handleFocus}
            label={label}
            required={required}
            autoComplete='off'
            InputLabelProps={{
              shrink: !!value || !!search || !!open
            }}
            disabled={disabled}
            error={props.error}
            InputProps={{
              endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={30} /> :
                        value && !disabled ? (
                            <IconButton
                                aria-label="clear button"
                                onClick={clearOption}
                            >
                              <CloseIcon  />
                            </IconButton>
                        ): null}
                  </React.Fragment>
              ),
            }}
        />
        <FormHelperText className={styles.error} error={props.error}>
          {props.error ? `${props.helperText}. Choose option in the list.` : null}
        </FormHelperText>
        <Popper
            open={search?.length>0 && open}
            container={anchorEl.current}
            anchorEl={anchorEl.current}
            className={`${styles.dropdownMenu}`}
            transition
        >
          {({TransitionProps}) => (
              <Fade {...TransitionProps} timeout={300}>
                <Paper className={`${styles.menuWrap}`}>
                  {renderDropdown()}
                </Paper>
              </Fade>
          )}
        </Popper>
      </div>
  );
};
export default Autocomplete;
