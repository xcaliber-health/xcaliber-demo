import { gql } from "@apollo/client";
export const SaveUserWidgetPreferences = gql`
  mutation SaveUserWidgetPreferences(
    $request: SaveUserWidgetPreferencesRequest!
  ) {
    SaveUserWidgetPreferences(
      request: $request
    ) {
      id
    }
  }
`;
