import wrapperRaf from '../../_util/raf';
const defaultState = new Map();
export default {
    data(){
      return {
        colsWidths: defaultState,
        rafRef: undefined,
        tempState: defaultState,
        updateBatchRef: [],
        stickyOffsets: {
          left: [],
          right: [],
        },
        columnCount: undefined,
        leafColumns: [],
        stickyColumns:[],
        colWidths:[],
      };
    },
    computed:{
      colWidthsCount({colWidths, columnCount}){
        return {colWidths, columnCount};
      },
    },
    watch:{
      stickyColumns:{
        immediate: true,
        handler(val){
          this.columnCount = val.length;
        },
      },
      colWidthsCount:{
        immediate:true,
        handler(val){
          const {colWidths, columnCount} = val;
          const leftOffsets = [];
          const rightOffsets = [];
          let left = 0;
          let right = 0;

          for (let start = 0; start < columnCount; start += 1) {
            // Left offset
            leftOffsets[start] = left;
            left += colWidths[start] || 0;

            // Right offset
            const end = columnCount - start - 1;
            rightOffsets[end] = right;
            right += colWidths[end] || 0;
          }
          this.stickyOffsets = {
            left: leftOffsets,
            right: rightOffsets,
          };
        },
      },
    },
    beforeDestroy(){
      wrapperRaf.cancel(this.rafRef);
    },
    methods:{
      updateColsWidths(updater){
        wrapperRaf.cancel(this.rafRef);
        this.updateBatchRef.push(updater);

        this.rafRef = wrapperRaf(() => {
          const prevBatch = this.updateBatchRef;
          this.updateBatchRef = [];

          prevBatch.forEach(batchUpdater => {
            this.tempState = batchUpdater(this.tempState);
          });

          this.colsWidths = this.tempState;
        });
      },
    },
  };
