<template>
  <div class="my-container-block">
    <div class="d-flex flex-column align-items-center">
      <h3 class="modt my-title my-3">{{ titleFormatted }}</h3>

      <h6 class="modt my-subtitle mb-4">
        from this
        <a
          href="https://en.wikipedia.org/wiki/Timeline_of_chemical_element_discoveries"
          >Wikipedia page
        </a>
        through
        <a
          href="https://www.mediawiki.org/wiki/API:Parsing_wikitext#Example_1:_Parse_content_of_a_page"
          >their API
        </a>
      </h6>

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
.my-container-block {
  padding-left: 50px;
  padding-right: 50px;
}

.modt.subtitle.local {
  margin-bottom: 140px;
}
</style>
