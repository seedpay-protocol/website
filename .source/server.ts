// @ts-nocheck
import * as __fd_glob_24 from "../content/docs/security/privacy.mdx?collection=docs"
import * as __fd_glob_23 from "../content/docs/security/payment-verification.mdx?collection=docs"
import * as __fd_glob_22 from "../content/docs/security/index.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/security/economic-attacks.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/reference/references.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/reference/message-types.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/reference/future-extensions.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/core-protocol/verification.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/core-protocol/payment-channels.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/core-protocol/index.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/core-protocol/handshake.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/core-protocol/data-transfer.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/implementation/index.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/implementation/error-handling.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/implementation/cryptography.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/implementation/blockchain-integration.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/getting-started/index.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/getting-started/design-principles.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/security/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/reference/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/implementation/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/core-protocol/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "core-protocol/meta.json": __fd_glob_1, "getting-started/meta.json": __fd_glob_2, "implementation/meta.json": __fd_glob_3, "reference/meta.json": __fd_glob_4, "security/meta.json": __fd_glob_5, }, {"index.mdx": __fd_glob_6, "getting-started/design-principles.mdx": __fd_glob_7, "getting-started/index.mdx": __fd_glob_8, "implementation/blockchain-integration.mdx": __fd_glob_9, "implementation/cryptography.mdx": __fd_glob_10, "implementation/error-handling.mdx": __fd_glob_11, "implementation/index.mdx": __fd_glob_12, "core-protocol/data-transfer.mdx": __fd_glob_13, "core-protocol/handshake.mdx": __fd_glob_14, "core-protocol/index.mdx": __fd_glob_15, "core-protocol/payment-channels.mdx": __fd_glob_16, "core-protocol/verification.mdx": __fd_glob_17, "reference/future-extensions.mdx": __fd_glob_18, "reference/message-types.mdx": __fd_glob_19, "reference/references.mdx": __fd_glob_20, "security/economic-attacks.mdx": __fd_glob_21, "security/index.mdx": __fd_glob_22, "security/payment-verification.mdx": __fd_glob_23, "security/privacy.mdx": __fd_glob_24, });