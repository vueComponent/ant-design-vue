<template>
  <div>
    <Basic />
    <br>
    <NoBorder />
    <br>
    <Concise />
    <br>
    <ColRowCard />
    <br>
    <Loading />
    <br>
    <Grid />
    <br>
    <Inline />
    <br>
    <TabsCard />
    <br>
    <MoreConfigs />
    <br>
  </div>
</template>
<script>
import Basic from './basic'
import NoBorder from './noBorder'
import Concise from './concise'
import ColRowCard from './colRowCard'
import Loading from './loading'
import Grid from './grid'
import Inline from './inline'
import TabsCard from './tabsCard'
import MoreConfigs from './moreConfigs'
export default {
  components: {
    Basic,
    NoBorder,
    Concise,
    ColRowCard,
    Loading,
    Grid,
    Inline,
    TabsCard,
    MoreConfigs,
  },
}
</script>
