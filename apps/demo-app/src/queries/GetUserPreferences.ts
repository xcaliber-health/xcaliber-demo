import { gql } from "@apollo/client";

export const GetUserWidgetPreferences = gql`
  query GetUserWidgetPreferences($widgetType: String) {
    GetUserWidgetPreferences(widgetType: $widgetType) {
      id
      config
    }
  }
`;
