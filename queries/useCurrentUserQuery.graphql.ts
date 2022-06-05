/**
 * @generated SignedSource<<d7b1573c1e477cc531c71f92a2cc360d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type useCurrentUserQuery$variables = {};
export type useCurrentUserQuery$data = {
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"CurrentUser_me">;
  } | null;
};
export type useCurrentUserQuery = {
  variables: useCurrentUserQuery$variables;
  response: useCurrentUserQuery$data;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "useCurrentUserQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CurrentUser_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useCurrentUserQuery",
    "selections": [
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
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Picture",
            "kind": "LinkedField",
            "name": "picture",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e3e4e6170c793ed443eadf8a87a81c12",
    "id": null,
    "metadata": {},
    "name": "useCurrentUserQuery",
    "operationKind": "query",
    "text": "query useCurrentUserQuery {\n  me {\n    ...CurrentUser_me\n    id\n  }\n}\n\nfragment CurrentUser_me on User {\n  id\n  email\n  name\n  picture {\n    url\n  }\n}\n"
  }
};

(node as any).hash = "1341f45f2e71aba1f68c0cb80c915a13";

export default node;
