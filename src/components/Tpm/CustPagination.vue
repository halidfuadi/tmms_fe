<template>
  <div>
    <nav v-if="show">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>
        <li v-for="page in links" :key="page" class="page-item"
          :class="{ active: page === currentPage, disabled: isNaN(page) }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    limitButton: {
      type: Number,
      default: 3
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    pages: function () {
      var pages = [];

      for (var i = 1; i <= this.totalPages; i++)
      {
        pages.push(i);
      }

      return pages;
    },
    links: function () {
      var first = [1, '...'],
        last = ['...', this.totalPages],
        range = [];

      if (this.currentPage <= this.limitButton)
      {
        range = this.range(1, this.limitButton + 1);

        //return (this.currentPage + range.length) <= this.totalPages ? range.concat(last) : range;
        return (this.limitButton < this.totalPages) ? range.concat(last) : range;
      }
      else if (this.currentPage > (this.totalPages - this.limitButton))
      {
        /*range = this.range(this.totalPages - (this.limitButton), this.totalPages);

        return (this.currentPage - range.length) >= 1 ? first.concat(range) : range;*/

        range = this.range(this.totalPages - this.limitButton + 1, this.totalPages + 1);

        // Tambahkan titik pertama jika diperlukan
        return first.concat(range);
      }
      else
      {
        /*range = this.range(
          this.currentPage - Math.ceil(this.limitButton / 2),
          this.currentPage + Math.ceil(this.limitButton / 2)
        );

        return first.concat(range).concat(last);*/
        // Perbaikan logika untuk memastikan ada keseimbangan di sekitar currentPage
        let half = Math.floor(this.limitButton / 2);
        let start = this.currentPage - half;
        let end = this.currentPage + half;

        // Koreksi jika di dekat batas awal atau akhir
        if (start < 1) {
          start = 1;
          end = this.limitButton;
        }
        if (end > this.totalPages) {
          end = this.totalPages;
          start = this.totalPages - this.limitButton + 1;
        }

        range = this.range(start, end + 1);

        return first.concat(range).concat(last);
      }
    },
    next: function () {
      var next = this.currentPage + 1;

      return next <= this.totalPages ? next : false;
    },
    prev: function () {
      return this.currentPage - 1;
    },
    show: function () {
      return true;
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages)
      {
        this.$emit('page-changed', page);
      }
    },
    prevPage() {
      this.changePage(this.currentPage - 1);
    },
    nextPage() {
      this.changePage(this.currentPage + 1);
    },
    range: function (start, end) {
      var pages = [];

      for (var i = start - 1; i < end; i++)
      {
        if (this.pages[i])
        {
          pages.push(this.pages[i]);
        }
      }

      return pages;
    },
  }
};
</script>

<style>
/* Add any custom styling for pagination here */
</style>
