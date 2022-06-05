/**
 * @generated SignedSource<<396cb1859abd475292003cd7947d630a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SettingsQuery$variables = {};
export type SettingsQuery$data = {
  readonly me: {
    readonly id: string;
    readonly email: string | null;
    readonly name: string | null;
  } | null;
};
export type SettingsQuery = {
  variables: SettingsQuery$variables;
  response: SettingsQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
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
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsQuery",
    "selections": (v0/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SettingsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "5081bcca3cb5df2c0af9ccb6acab0083",
    "id": null,
    "metadata": {},
    "name": "SettingsQuery",
    "operationKind": "query",
    "text": "query SettingsQuery {\n  me {\n    id\n    email\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "220e9f58c86f3703bfb11ffc03362a23";

export default node;
