import { Request } from 'express';
import { APP_CONFIG } from 'src/config/app.config';
import { PriceFilterType } from '../types/product-filter.type';
import { QueryParseType } from '../types/query-parse.type';
import { isEmptyObject } from './isEmptyObject';
import { AttributeSpecItemFilterType } from '../types/attribute-spec-item-filter.type';

export const queryParser = (req: Request): QueryParseType => {
  let queryParsed: QueryParseType;
  const pageTemp = req.query.page;
  const brand = req.query.brand;
  const price = req.query.price;
  const cpu = req.query.cpu;
  const gpu = req.query.gpu;
  const screen = req.query.screen;
  const ssd = req.query.ssd;
  const ram = req.query.ram;
  const zeroPayment = req.query.zero;
  const productSortBy = req.query.sort;

  // for generate pagination
  const isPage = pageTemp && Number.isInteger(+pageTemp) && +pageTemp > 0;
  const page = isPage ? +pageTemp : 1;

  // set init queryParsed
  queryParsed = {
    pagination: {
      limit: APP_CONFIG.queryLimit,
      page: page,
    },
    productFilters: {
      $and: [{}],
    },
    productSort: { 'productVariant.stockQuantity': -1 },
    hasFilterProduct: false,
    hasFilterByAttributeSpecItem: false,
    attributeSpecItemFilters: {},
  };

  // for generate  brand filter
  if (brand) {
    queryParsed.hasFilterProduct = true;

    let brandNameFilter = {
      $regex: brand.toString(),
      $options: 'i',
    };

    if (isEmptyObject(queryParsed.productFilters.$and[0])) {
      queryParsed.productFilters.$and[0] = { brandName: brandNameFilter };
    } else {
      queryParsed.productFilters.$and.push({ brandName: brandNameFilter });
    }
  }

  // for product find product has installment payment 0%
  if (zeroPayment) {
    queryParsed.hasFilterProduct = true;

    let zeroPaymentRegExp = {
      $regex: zeroPayment.toString(),
      $options: 'i',
    };

    if (isEmptyObject(queryParsed.productFilters.$and[0])) {
      queryParsed.productFilters.$and[0] = { labelInst: zeroPaymentRegExp };
    } else {
      queryParsed.productFilters.$and.push({ labelInst: zeroPaymentRegExp });
    }
  }

  // for generate price filter
  if (price) {
    queryParsed.hasFilterProduct = true;

    // convert from 0-10e6|15e6-20e6 ----> ['0-10e6' , '15e6-20e6']
    const priceConditionsString = price.toString().split('|');
    // convert to PriceFilterType[]
    const priceConditions = priceConditionsString.map((priceCondition) => {
      const [gte, lte] = priceCondition.split('-');
      if (Number.isInteger(+lte) && Number.isInteger(+gte)) {
        const query: PriceFilterType = {
          $and: [
            { 'productVariant.price': { $gte: +gte } },
            { 'productVariant.price': { $lte: +lte } },
          ],
        };
        return query;
      }
    });

    if (isEmptyObject(queryParsed.productFilters.$and[0])) {
      queryParsed.productFilters.$and[0] = { $or: priceConditions };
    } else {
      queryParsed.productFilters.$and.push({ $or: priceConditions });
    }
  }

  // for attribute spec item filter by screen
  if (screen) {
    queryParsed.hasFilterByAttributeSpecItem = true;

    queryParsed.attributeSpecItemFilters = setFilter(
      queryParsed.attributeSpecItemFilters,
      screen.toString(),
    );
  }

  // for attribute spec item filter by cpu
  if (cpu) {
    queryParsed.hasFilterByAttributeSpecItem = true;

    queryParsed.attributeSpecItemFilters = setFilter(
      queryParsed.attributeSpecItemFilters,
      cpu.toString(),
    );
  }

  // for attribute spec item filter by gpu
  if (gpu) {
    queryParsed.hasFilterByAttributeSpecItem = true;

    queryParsed.attributeSpecItemFilters = setFilter(
      queryParsed.attributeSpecItemFilters,
      gpu.toString(),
    );
  }

  // for attribute spec item filter by ssd
  if (ssd) {
    queryParsed.hasFilterByAttributeSpecItem = true;

    queryParsed.attributeSpecItemFilters = setFilter(
      queryParsed.attributeSpecItemFilters,
      ssd.toString(),
    );
  }

  // for attribute spec item filter by ssd
  if (ram) {
    queryParsed.hasFilterByAttributeSpecItem = true;

    queryParsed.attributeSpecItemFilters = setFilter(
      queryParsed.attributeSpecItemFilters,
      ram.toString(),
    );
  }

  // for parse sort query string
  if (productSortBy) {
    const parsedSortQuery = parseSortQuery(productSortBy.toString());
    queryParsed.productSort = parsedSortQuery;
  }
  if (isEmptyObject(queryParsed.productFilters.$and[0]))
    delete queryParsed.productFilters;

  if (isEmptyObject(queryParsed.attributeSpecItemFilters))
    delete queryParsed.attributeSpecItemFilters;

  return queryParsed;
};

/**
 *
 * @param sortQuery
 * @returns
 */
function parseSortQuery(sortQuery: string) {
  if (sortQuery === 'low_price') return { 'productVariant.price': 1 };
  if (sortQuery === 'hight_price') return { 'productVariant.price': -1 };

  return { 'productVariant.stockQuantity': -1 };
}

function setFilter(
  parentObject: AttributeSpecItemFilterType,
  queryString: string,
): AttributeSpecItemFilterType {
  let filter = {
    'attributeSpecItems.specName': {
      $regex: queryString.toString(),
      $options: 'i',
    },
  };

  if (parentObject.$and) {
    parentObject.$and.push(filter);
  } else {
    parentObject = {
      $and: [filter],
    };
  }

  return parentObject;
}
