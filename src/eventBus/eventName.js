/**
 * Created by Administrator on 2018/9/30.
 */
//事件总线的名称，保证不同，不被覆盖,const不被修改
const eventName = {
  //更新新鲜事队列
  updateMessageList:'updateMessageList',
  //设置新鲜事评论数量
  updateMessageCommentNum:'updateMessageCommentNum',
  //删除回复后重新拉取回复数据
  reFetchReplies:'reFetchReplies',
  //删除评论后重新拉取评论数据
  reFetchComments:'reFetchComments'
};
export default eventName
