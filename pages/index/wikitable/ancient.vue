<template>
  <TabWiki :title="title" :page="page" :section="section" />
</template>

<script>
import TabWiki from '~/components/tab-wiki';

export default {
  name: 'BlockAncient',
  components: { TabWiki },
  props: {},
  data() {
    return {
      page: 'Timeline_of_chemical_element_discoveries',
      section: 2,
      title: 'ancient chemical element discoveries'
    };
  }
};
</script>

<style lang="scss" scoped></style>
