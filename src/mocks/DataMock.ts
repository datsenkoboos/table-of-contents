import type { DataModel } from '@/models';

const DataMock: DataModel = {
  pages: {
    node_without_children: {
      key: 'node_without_children',
      name: 'Node without children',
      level: 0,
      link: 'node-without-children.html',
    },
    node_with_children: {
      key: 'node_with_children',
      name: 'Node with children',
      level: 0,
      link: 'node-with-children.html',
      childPageKeys: [
        'circa_midst_unimpressively_armpit_brr',
        'although_composite_display',
      ],
    },
    circa_midst_unimpressively_armpit_brr: {
      key: 'circa_midst_unimpressively_armpit_brr',
      name: 'Circa midst unimpressively armpit brr',
      level: 1,
      link: 'circa-midst-unimpressively-armpit-brr.html',
      parentKey: 'node_with_children',
    },
    although_composite_display: {
      key: 'although_composite_display',
      name: 'Although composite display',
      level: 1,
      link: 'although-composite-display.html',
      parentKey: 'node_with_children',
      childPageKeys: ['nested_node'],
    },
    nested_node: {
      key: 'nested_node',
      name: 'Nested node',
      level: 2,
      link: 'nested-node.html',
      parentKey: 'although_composite_display',
    },
    concerning_ah: {
      key: 'concerning_ah',
      name: 'Concerning ah',
      level: 0,
      link: 'concerning-ah.html',
      childPageKeys: ['supermarket_degree_ha_per_crawl_which', 'hint_charter'],
    },
    supermarket_degree_ha_per_crawl_which: {
      key: 'supermarket_degree_ha_per_crawl_which',
      name: 'Supermarket degree ha per crawl which',
      level: 1,
      link: 'supermarket-degree-ha-per-crawl-which.html',
      parentKey: 'concerning_ah',
      childPageKeys: ['nor_absent', 'depict_hiking_oh_subdivide_plus'],
    },
    nor_absent: {
      key: 'nor_absent',
      name: 'Nor absent',
      level: 2,
      link: 'nor-absent.html',
      parentKey: 'supermarket_degree_ha_per_crawl_which',
    },
    depict_hiking_oh_subdivide_plus: {
      key: 'depict_hiking_oh_subdivide_plus',
      name: 'Depict hiking oh subdivide plus',
      level: 2,
      link: 'depict-hiking-oh-subdivide-plus.html',
      parentKey: 'supermarket_degree_ha_per_crawl_which',
    },
    hint_charter: {
      key: 'hint_charter',
      name: 'Hint charter',
      level: 1,
      link: 'hint-charter.html',
      parentKey: 'concerning_ah',
    },
  },
  rootLevelKeys: [
    'node_without_children',
    'node_with_children',
    'concerning_ah',
  ],
};
export default DataMock;
