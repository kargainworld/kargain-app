import React, { useContext, useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import useTranslation from 'next-translate/useTranslation'
import { MessageContext } from '../../context/MessageContext'

import SearchService from '../../services/SearchService'

const AutocompleteDropdown = () => {
    const { t } = useTranslation()
    const filter = createFilterOptions();

    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        { title: 'The Godfather: Part II', year: 1974 }
    ];

    const { dispatchModal, dispatchModalError } = useContext(MessageContext)

    const [results, setResutls] = useState([]);
    const [value, setValue] = useState(null);

    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                    setValue({
                        title: newValue,
                    });
                } else if (newValue && newValue.inputValue) {
                    setValue({
                        title: newValue.inputValue,
                    });
                } else {
                    setValue(newValue);
                }
            }}
            onInputChange={async (event, inputValue, reason)=> {

                if(inputValue === "") return

                await SearchService.fetchSearchResults({ q : inputValue})
                    .then(searchresults => {
                        const { tags, users, announces } = searchresults
                        const newOptions = [];
                        announces.map((row, index) => {
                            if(index < 10)  newOptions.push({title: row.title, userAvatarUrl: row.user, group: "Announces"})
                        })
                        users.map((row, index) => {
                            if(index < 10)  newOptions.push({title: row.fullname, userAvatarUrl: row.avatarUrl, group: "Users"})
                        })
                        
                        setResutls(newOptions)
                    }).catch(err => {
                        dispatchModalError({ err })
                    })
                return
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={results}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => {
                if (typeof option === 'string') {
                return option;
                }
                if (option.inputValue) {
                return option.inputValue;
                }
                return option.title;
            }}
            renderOption={(option) => option.title}
            style={{ width: 300 }}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} label={t('layoutC:search')} variant="outlined" />
            )}
        />
    );

}
export default AutocompleteDropdown