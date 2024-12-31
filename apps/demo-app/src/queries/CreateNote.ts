import { gql } from "@apollo/client";
export const CreateNote = gql`
  mutation CreateNote($request: JSON) {
    CreateNote(request: $request)
  }
`;
