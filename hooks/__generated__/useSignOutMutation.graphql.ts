/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type useSignOutMutationVariables = {};
export type useSignOutMutationResponse = {
    readonly signOut: string | null;
};
export type useSignOutMutation = {
    readonly response: useSignOutMutationResponse;
    readonly variables: useSignOutMutationVariables;
};



/*
mutation useSignOutMutation {
  signOut
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "signOut",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "useSignOutMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useSignOutMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "c0a9a141b40ffd855ec90f743197d1b1",
    "id": null,
    "metadata": {},
    "name": "useSignOutMutation",
    "operationKind": "mutation",
    "text": "mutation useSignOutMutation {\n  signOut\n}\n"
  }
};
})();
(node as any).hash = 'e09800d725e76ecd661060cd1beba32a';
export default node;
