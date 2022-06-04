/**
 * @generated SignedSource<<d95dc6dc3c9e140d416b9ad0056822e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type accountSettingsQuery$variables = {};
export type accountSettingsQuery$data = {
  readonly me: {
    readonly id: string;
    readonly email: string | null;
    readonly name: string | null;
  } | null;
};
export type accountSettingsQuery = {
  variables: accountSettingsQuery$variables;
  response: accountSettingsQuery$data;
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
    "name": "accountSettingsQuery",
    "selections": (v0/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "accountSettingsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "19fa40167cdff4b3b5bf10bbddd7df6f",
    "id": null,
    "metadata": {},
    "name": "accountSettingsQuery",
    "operationKind": "query",
    "text": "query accountSettingsQuery {\n  me {\n    id\n    email\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "6fe8891a11bf2429aa255fc4739d1cfd";

export default node;
