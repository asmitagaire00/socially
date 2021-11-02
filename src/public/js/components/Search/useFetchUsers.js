import { useState, useEffect } from 'react';
import axios from 'axios';

import config from '../../config/config';

function useFetchUsers(query) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    (async () => {
      try {
        const response = await axios({
          method: 'GET',
          withCredentials: true,
          url: `${config.apiUrl}/api/v1/search/users?q=${query}`,
          cancelToken: new axios.CancelToken((c) => {
            cancel = c;
          }),
        });
        const { data } = response.data;

        setUsers(data);
        setLoading(false);
      } catch (e) {
        setError(true);
      }
    })();

    return () => cancel();
  }, [query]);

  return { users, error, loading };
}

export default useFetchUsers;
