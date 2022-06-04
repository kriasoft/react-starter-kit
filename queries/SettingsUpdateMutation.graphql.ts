/**
 * @generated SignedSource<<47e65d58668ea69ae46c055b0a82a33d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateUserInput = {
  id: string;
  username?: string | null;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  timeZone?: string | null;
  locale?: string | null;
};
export type SettingsUpdateMutation$variables = {
  input: UpdateUserInput;
};
export type SettingsUpdateMutation$data = {
  readonly updateUser: {
    readonly user: {
      readonly id: string;
      readonly email: string | null;
      readonly name: string | null;
    } | null;
  } | null;
};
export type SettingsUpdateMutation = {
  variables: SettingsUpdateMutation$variables;
  response: SettingsUpdateMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateUserPayload",
    "kind": "LinkedField",
    "name": "updateUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6258712495be6771857e5eeaf3824c14",
    "id": null,
    "metadata": {},
    "name": "SettingsUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsUpdateMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    user {\n      id\n      email\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "df71ecae8cc68fe748f65642ef185c6d";

export default node;
