/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useFetchUsers from './useFetchUsers';
import { createConversation } from '../../redux/ChatSlice';

function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const { users } = useFetchUsers(query);
  const { user } = useSelector((state) => state.auth.account);
  const dispatch = useDispatch();

  const loading = open && options.length === 0;

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (selectedOption) {
      const selectedUser = selectedOption.user.id;
      const userIds = [user, selectedUser];
      dispatch(createConversation({ userIds }));
    }
  }, [dispatch, selectedOption, user]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Autocomplete
        style={{ width: 300 }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionSelected={(option, value) =>
          option.firstName === value.firstName
        }
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        options={users?.filter((u) => u.user.id !== user)}
        onChange={(_e, option) => {
          setSelectedOption(option);
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            value={query}
            onChange={handleInputChange}
            label=""
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                </>
              ),
            }}
          />
        )}
      />
      {inputValue && <p>{inputValue}</p>}
    </>
  );
}

export default Search;
