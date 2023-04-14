const query = [
  {
    $lookup: {
      from: 'attributespecitems',
      localField: 'attributeSpecItems',
      foreignField: '_id',
      pipeline: [
        {
          $sort: {
            'attributeSpecItems.attributeID': -1,
          },
        },
      ],
      as: 'attributeSpecItems',
    },
  },
  {
    $match: {
      $and: [
        {
          'attributeSpecItems.specName': {
            $regex: /^8 gb/,
            $options: 'i',
          },
        },
        {
          'attributeSpecItems.specName': {
            $regex: /i5/,
            $options: 'i',
          },
        },
      ],
    },
  },
  {
    $sort: {
      'productVariant.stockQuantity': -1,
    },
  },
];
