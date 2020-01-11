<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-5 mb-2">{{ titleFormatted }}</div>
      <div class="subtitle-1 modt my-subtitle mb-0">
        From this
        <a
          href="https://en.wikipedia.org/wiki/Timeline_of_chemical_element_discoveries"
          >Wikipedia page
        </a>
        through
        <a
          href="https://www.mediawiki.org/wiki/API:Parsing_wikitext#Example_1:_Parse_content_of_a_page"
          >their API
        </a>
      </div>
      <div class="subtitle-1 modt my-subtitle mb-3">
        NOTE: For some reason table borders & vertical scroll do not show in
        vuetify (they do in bootstrap)
      </div>

      <div class="d-flex flex-row mt-2 mb-4">
        <WikiTable :page="page" :section="section" />
      </div>
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';
import WikiTable from '~/components/tab-wiki-table';

export default {
  name: 'TabkWiki',
  components: { WikiTable },
  props: {
    page: { type: String, required: true },
    section: { type: Number, required: true },
    title: { type: String, required: true }
  },
  data() {
    return {};
  },
  computed: {
    titleFormatted() {
      return capitalCase(this.title);
    }
  }
};
</script>

<style lang="scss" scoped>
.my-wrapper-block {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
