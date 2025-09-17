import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { orderItemType } from "./orderItemType";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authorType";
import { productReelType } from "./productReelType";
import { couponType } from "./couponType";
import { userCartType } from "./userCartType";
import { userWishlistType } from "./userWishlistType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    orderItemType,
    blogType,
    blogCategoryType,
    authorType,
    productReelType,
    userWishlistType,
    userCartType,
    couponType,
  ],
};
