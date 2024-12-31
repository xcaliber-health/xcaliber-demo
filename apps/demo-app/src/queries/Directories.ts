import { gql } from "@apollo/client";

export const Directories = gql`
  query {
    Directories {
      id
      accountId
      instanceId
      name
      type
      description
      status
      schema {
        models {
          id
          namespace
          description
          typeName
          status
          attributes {
            tags {
              id
              name
              type
              scope
              description
              valueSchema {
                range {
                  max
                  min
                }
              }
            }
            id
            name
            description
            valueSchema {
              codeset
              default
              range {
                max
                min
              }
            }
            label
            type
            scope
          }
          root
        }
      }
    }
  }
`;
