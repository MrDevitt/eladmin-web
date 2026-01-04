<template>
  <elFrame :src="dozzleApi" />
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe/index'

export default {
  name: 'Dozzle',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'dozzleApi'
    ])
  }
}
</script>
