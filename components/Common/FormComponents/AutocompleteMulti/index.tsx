// Libs
import React, {useState, ChangeEvent, ReactNode, useRef, useEffect} from 'react';
import {useFieldArray, useFormContext} from "react-hook-form";
// Services
import api from "services/axios";
// MUI Components
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import FormHelperText from "@mui/material/FormHelperText";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
// Styles
import styles from './style.module.scss'
import {FilterService} from "@/helpers/filterService";

interface SearchParams {
    url: string
    searchBy?: string[]
    limit?: number
    searchByScopeName?: string
    exclude?: [string, (string|number|boolean|null|undefined)[]][]
    simpleSearchParam?: boolean
    filterService?: FilterService
}

interface AutocompleteProps {
    name: string
    labelName?: string
    defaultValue?: any[]
    label?: string
    onChange?: (val?: any[]) => void
    error?: boolean
    disabled?: boolean
    helperText?: any
    clearValidation?: () => void
    control?: any
    searchParams: SearchParams
    getName?: (option: any) => string
}

const AutocompleteMulti = (props : AutocompleteProps) => {
    const {
        name,
        disabled,
        labelName = 'name',
        defaultValue,
        label = 'Select option',
        control,
        searchParams
    } = props;

    const {
        url,
        searchByScopeName,
        limit = 20,
        searchBy = ['name'],
        exclude = [],
        simpleSearchParam = false,
        filterService = new FilterService()
    } = searchParams

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState<string | null>('');
    const anchorEl = useRef(null);
    const [filter] = useState(filterService);
    const {fields, remove, append} = useFieldArray({control, name: `${name}`});

    /**
     * Set Default values
     */
    useEffect(() => {
        if (defaultValue && !fields.length) {
                defaultValue.map((val) => {
                    append({id: val.id, [labelName]: val[labelName]});
                });
        }
    }, [])

    /**
     * Get option name callback
     */
    const getOptionName = (item: any) => {
        let childNode;
        if (props.getName) {
            childNode = props.getName(item);
        } else {
            childNode = item[labelName]
        }

        return childNode;
    }


    /**
     * Get List
     */
    const getList = async () => {
        setLoading(true);

        if(searchBy) filter.searchItems([...searchBy]);
        filter.limit(limit);

        searchByScopeName ?
            filter.scope({ "name": searchByScopeName, "parameters": [search] }) :
            simpleSearchParam ? filter.params([{key:'search', value: search as string}]) :
                filter.search(search || '');

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

        try {
            const response = await api.get(`${url}?${filter.filter}`);
            const data = response.data
            const options = data
            setOptions(options);
            setOpen(true);
            setLoading(false);
        } catch (e) {
            console.error(e, 'error')
            setLoading(false);
        }
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if(props.clearValidation) props.clearValidation();
        event.persist();
        setSearch(event.target.value);
    };

    /**
     * SEARCH
     */
    useEffect(() => {
        if (search) {
            searchAction()
        }
    }, [search])

    const searchAction = async () => {
        if (!search || search?.length < 1) {
            setOptions([]);
            return
        }
        else await getList();
    };

    /**
     * Select Option
     * @param e
     */
    const selectOption = (e: any) => () => {
        setSearch('');
        const label = getOptionName(e);

        append({id: e.id, label});
    }

    /**
     * Handle Blur
     */
    const handleBlur = () => {
        if(open) {
            setTimeout(()=>{
                setOpen(false);
            },0);
        }
    }

    /**
     * Handle Focus
     */
    const handleFocus = () => {
        setOpen(true);
    }

    /**
     * Render Dropdown List
     */
    const renderChildren = () => {
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
                                className={styles.autocompleteList_item}
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
        <div className={`${styles.autocompleteContainer}`}>
            <TextField
                ref={anchorEl}
                fullWidth={true}
                variant={'outlined'}
                onChange={handleSearchChange}
                value={search}
                disabled={disabled}
                onBlur={handleBlur}
                onFocus={handleFocus}
                label={label}
                autoComplete='off'
                error={props.error}
                InputProps={{
                    className: styles.textfield,
                    startAdornment: fields.length? (
                        <>
                            {fields.map((item: any, idx) => (
                                <div key={idx}>
                                    <Chip
                                        size='small'
                                        key={`${name}__${idx}`}
                                        label={item[labelName]}
                                        onDelete={() => {
                                            remove(idx);
                                        }}
                                        onMouseDown={(e) => e.preventDefault()}
                                        deleteIcon={<CloseIcon/>}
                                    />
                                </div>
                            ))}
                        </>
                    ) : undefined
                }}
            />
            <FormHelperText className={styles.error} error={props.error}>
                {props.error ? `${props.helperText}. Choose option in the list.` : null}
            </FormHelperText>
            <Popper
                open={!!search && search.length > 0 && open}
                container={anchorEl.current}
                anchorEl={anchorEl.current}
                className={`${styles.dropdownMenu}`}
                transition
            >
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={300}>
                        <Paper className={`${styles.menuWrap}`}>
                            {renderChildren()}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};
export default AutocompleteMulti;
