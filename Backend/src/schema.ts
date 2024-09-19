import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

import userResolvers from './resolvers/userResolvers';
import userTypeDefs from './typeDefs/userTypeDefs';
import taskResolvers from './resolvers/taskResolvers';
import taskTypeDefs from './typeDefs/taskTypeDefs';

const typeDefs = mergeTypeDefs ([
    userTypeDefs,
    taskTypeDefs
])

const resolvers = mergeResolvers([
    userResolvers,
    taskResolvers
])

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
export default schema