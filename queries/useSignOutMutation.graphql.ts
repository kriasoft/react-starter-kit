/**
 * @generated SignedSource<<2971868627cbf91a3b4f124e52919c96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type useSignOutMutation$variables = {};
export type useSignOutMutation$data = {
  readonly signOut: string | null;
};
export type useSignOutMutation = {
  variables: useSignOutMutation$variables;
  response: useSignOutMutation$data;
};

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

(node as any).hash = "e09800d725e76ecd661060cd1beba32a";

export default node;
