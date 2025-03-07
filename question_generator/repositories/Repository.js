import AuthRepository from '~/repositories/authentication/AuthRepository'
import UserRepository from '~/repositories/user/UserRepository'
import FriendRepository from '~/repositories/friend/FriendRepository'
import UploadsRepository from '~/repositories/uploads/UploadsRepository'
import GeneratorRepository from '~/repositories/generator/GeneratorRepository'

import QuestionRepository from '~/repositories/question/QuestionRepository'

export default ($axios) => ({
  auth: AuthRepository($axios),
  user: UserRepository($axios),
  friend: FriendRepository($axios),
  uploads: UploadsRepository($axios),
  generator: GeneratorRepository($axios),

  question: QuestionRepository($axios),
})
