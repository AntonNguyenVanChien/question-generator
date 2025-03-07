<template>
  <div class="error-layout">
    <section class="m-auto announce">
      <h5 class="heading">
        <span v-if="error.statusCode === errorCode.PAGE_NOT_FOUND">
          The page you were looking for was not found
        </span>
        <span v-else> An error occurred </span>
      </h5>
      <p class="m-0 announce__sentence">
        <span v-if="error.statusCode === errorCode.PAGE_NOT_FOUND">
          The page you are looking for may be temporarily inaccessible, moved or
          deleted.
        </span>
        <span v-else>
          The operation you just performed has an error, moved or deleted.
        </span>
      </p>
      <div
        class="announce-action d-flex align-items-center justify-content-center"
      >
        <b-button
          class="btn-announce error-btn"
          @click="$router.push({ path: SCREEN_PATH.TOP })"
        >
          To the Top
        </b-button>
      </div>
    </section>
  </div>
</template>

<script>
import { errorCode, SCREEN_PATH } from '~/utils/constants'

export default {
  name: 'ErrorLayout',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      errorCode,
      SCREEN_PATH,
    }
  },
}
</script>

<style lang="scss" scoped>
.announce {
  padding: 32px 16px;
  max-width: 640px;

  @media screen and (max-width: 1249px) {
    padding: 28px 14px;
  }

  .heading {
    padding-top: 16px;
  }

  .announce__sentence {
    padding-top: 16px;
  }

  .announce-action {
    padding-top: 40px;

    @media screen and (max-width: 1249px) {
      padding-top: 35px;
    }
  }
}
</style>
