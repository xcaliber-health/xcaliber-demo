import { gql } from "@apollo/client";
export const SearchDirectoryEntries = gql`
  mutation SearchDirectoryEntries(
    $DirectoryType: String
    $request: SearchDirectoryEntriesRequest!
  ) {
    SearchDirectoryEntries(
      type: $DirectoryType
      request: $request
    ) {
      data
      total
    }
  }
`;
