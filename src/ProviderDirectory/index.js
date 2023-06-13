import React, { useEffect, useState } from 'react';
import { Helper } from '../core-utils/helper';
import { Grid } from '@mui/material';
import axios from 'axios';
import { Help } from '@mui/icons-material';

export const PDPage = () => {
    const [managerView, setManagerView] = useState(false);
    useEffect(() => {
        // @ts-ignore
        const xcaliberClient = XcaliberWidgets.init({
            theme: {},
            getBearerToken: async () => {
                const token = await getToken(managerView);
                return `Bearer ${token}`;
            },
        });
        xcaliberClient.create("GRID_WIDGET", "pd");
    }, [managerView]);

    return (
        <>
            <Grid sx={{ height: "calc(100vh - 64px)" }} id="pd"></Grid>
        </>
    );
}

export const getToken = async (managerView) => {
    try {

        const httpLink = createHttpLink({
            uri: 'https://blitz.xcaliberapis.com/xcaliber-dev/bff/',
        });
        const authLink = setContext((_, { headers }) => {
            return {
                headers: {
                    ...headers,
                    authorization: process.env.REACT_APP_AUTHORIZATION,
                },
            };
        });
        const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
        });

        const res = client
            .query({
                query: GenerateToken,
                variables: {
                    token: process.env.AUTH_TOKEN,
                    managerView,
                    userId: managerView ? process.env.MANAGER_ID : process.env.CODER_ID,
                },
                fetchPolicy: "no-cache",
            })
            .then((response) => {
                return response?.data?.GenerateToken?.token;
            })
            .catch((error) => {
                console.log(error?.message);
            });
        return res;
    } catch (e) {
        console.error(e.message);
    }
};

export default PDPage;
