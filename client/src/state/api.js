import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${process.env.REACT_APP_BASE_URL}`,
        // Add Authorization header if token exists in state/localStorage
        prepareHeaders: (headers, { getState }) => {
            const token = getState().global.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    reducerPath: "AdminApi",
    tagTypes: ["User", "Products", "Customers", "Transactions", "Geography", "Admins", "Performance", "Dashboard"],
    endpoints: (build) => ({
        getUser: build.query({
            query: (id) => `general/user/${id}`, 
            providesTags: ["User"]
        }),
        getProducts: build.query({
            query: () => 'client/products',
            providesTags: ["Products"]
        }),
        getCustomers: build.query({
            query: () => 'client/customers',
            providesTags: ["Customers"]
        }),
        getTransactions: build.query({
            query: ({ page, pageSize, sort, search }) => ({
                url: 'client/transactions',
                method: 'GET',
                params: { page, pageSize, sort, search }
            }),
            providesTags: ["Transactions"]
        }),
        getGeography: build.query({
            query: () => 'client/geography',
            providesTags: ["Geography"]
        }),
        getSales: build.query({
            query: () => 'sales/sales',
            providesTags: ["Sales"]
        }),
        getAdmins: build.query({
            query: () => 'management/admins',
            providesTags: ["Admins"]
        }),
        getPerformance: build.query({
            query: (id) => `management/performance/${id}`,
            providesTags: ["Performance"]
        }),
        getDashboard: build.query({
            query: () => 'general/dashboard',
            providesTags: ["Dashboard"]
        }),
        
        // AUTH MUTATIONS
        loginUser: build.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials
            })
        }),
        registerUser: build.mutation({
            query: (user) => ({
                url: 'auth/register',
                method: 'POST',
                body: user
            })
        }),

        // PRODUCT CRUD MUTATIONS
        createProduct: build.mutation({
            query: (product) => ({
                url: 'client/products',
                method: 'POST',
                body: product
            }),
            invalidatesTags: ["Products"]
        }),
        updateProduct: build.mutation({
            query: ({ id, ...body }) => ({
                url: `client/products/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ["Products"]
        }),
        deleteProduct: build.mutation({
            query: (id) => ({
                url: `client/products/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Products"]
        })
    })
});

export const { 
    useGetUserQuery,
    useGetProductsQuery,
    useGetCustomersQuery,
    useGetTransactionsQuery,
    useGetGeographyQuery, 
    useGetSalesQuery,
    useGetAdminsQuery, 
    useGetPerformanceQuery,
    useGetDashboardQuery,
    useLoginUserMutation,
    useRegisterUserMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = api;