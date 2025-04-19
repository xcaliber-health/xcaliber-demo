import React, { useEffect, useState } from 'react';
import { Helper } from '../core-utils/helper';
import { Grid,Box,Switch, Typography } from '@mui/material';
import axios from 'axios';
import { Help } from '@mui/icons-material';
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { GenerateToken } from './Token';
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: 'https://blitz.xcaliberapis.com/xcaliber-dev2/bff/',
});
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: process.env.REACT_APP_AUTH_TOKEN2,
        },
    };
});
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
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
        <Box sx={{height:"83vh"}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "column-reverse",
                    alignItems: "flex-end",
                    marginRight: "10px",
                    height:"10%"
                }}
                >
                <Typography color="black" sx={{ marginRight: "10px" }}>
                    {managerView ? "Manager" : "Coder"}
                </Typography>
                <Switch
                    defaultChecked
                    size="small"
                    checked={managerView}
                    color="default"
                    onChange={() => {
                    setManagerView(!managerView);
                    }}
                />
            </Box>
            <Grid sx={{ height: "90%" }} id="pd"></Grid>
        </Box>
    );
}

export const getToken = async (managerView) => {
    try {

        const res = client
            .query({
                query: GenerateToken,
                variables: {
                    token: process.env.REACT_APP_AUTH_TOKEN2,
                    managerView,
                    userId: managerView ? '36645a2d-5b44-4e47-a980-4b283267fbc0' : 'b53ef72f-ef46-4d9b-b28b-2de2692bacat',
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
