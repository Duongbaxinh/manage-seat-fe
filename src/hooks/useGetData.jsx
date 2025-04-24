import axios from "axios";
import { useEffect, useState } from "react";

const useGetData = ({ url, authorization }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let config = {};
                if (authorization) {
                    const token = localStorage.getItem("accessToken");
                    config.headers = {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    };
                }

                const response = await axios.get(url, config);

                setData(response.data.result);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url, authorization]);

    return { data, loading, error, setData };
};

export default useGetData;
