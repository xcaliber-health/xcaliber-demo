import { gql } from "@apollo/client";

export const directoryById = gql`
  query DirectoryById($DirectoryType: String) {
    DirectoryById(type: $DirectoryType) {
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
            id
            name
            description
            valueSchema {
              codeset
              default
              type
              enumSet
              range {
                max
                min
              }
            }
            label
            readOnly
            systemOnly
            primaryKey
            type
            scope
            tags {
              id
              name
              type
              scope
              description
              valueSchema {
                codeset
                default
                range {
                  max
                  min
                }
                type
                enumSet
              }
              value
            }
          }
          root
        }
        relationships {
          id
          srcId
          destnId
          directoryId
          name
          basedOn
        }
      }
    }
  }
`;
export const directoryData = gql`
  query (
    $DirectoryType: String
    $pageSize: Int
    $pageNumber: Int
    $order: String
    $sort: String
  ) {
    DirectoryByIdEntries(
      type: $DirectoryType
      pageSize: $pageSize
      pageNumber: $pageNumber
      order: $order
      sort: $sort
    ) {
      id
      source
      data
      total
      status
      tags {
        id
        value
        name
      }
      attributeTags {
        id
        value
        name
      }
    }
  }
`;
export const coderSuggestions = gql`
  query ($DirectoryType: String, $request: SearchDirectoryUpdatesRequest!) {
    CoderActivities(type: $DirectoryType, request: $request) {
      id
      source
      data
      total
      status
      tags {
        id
        value
        name
      }
      attributeTags {
        id
        value
        name
      }
    }
  }
`;
export const DirectoryUpdates = gql`
  query ($DirectoryType: String, $request: SearchDirectoryUpdatesRequest!) {
    DirectoryUpdateActivities(type: $DirectoryType, request: $request) {
      id
      source
      data
      total
      status
      tags {
        id
        value
        name
      }
      attributeTags {
        id
        value
        name
      }
    }
  }
`;
export const directoryEntryById = gql`
  query DirectoryEntryById($directoryType: String, $entryId: String) {
    DirectoryEntryById(directoryType: $directoryType, entryId: $entryId) {
      id
      source
      data
      status
      attributeTags {
        id
        value
        name
      }
      tags {
        id
        value
        name
      }
    }
  }
`;

export const getEntryConfig = gql`
  query GetConfig {
    GetConfig {
      combineFields
      valuesAllignment
      groupFields
    }
  }
`;
