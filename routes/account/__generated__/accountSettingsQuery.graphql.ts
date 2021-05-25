/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type accountSettingsQueryVariables = {};
export type accountSettingsQueryResponse = {
    readonly me: {
        readonly id: string;
        readonly email: string | null;
        readonly name: string | null;
    } | null;
};
export type accountSettingsQuery = {
    readonly response: accountSettingsQueryResponse;
    readonly variables: accountSettingsQueryVariables;
};



/*
query accountSettingsQuery {
  me {
    id
    email
    name
  }
}
*/

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
(node as any).hash = '6fe8891a11bf2429aa255fc4739d1cfd';
export default node;
