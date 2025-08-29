import { userNameSchema, passwordSchema} from '~/validators/fields'

export function useFields() {
  const fieldsMap = {
    username: {
      groupId: 'username',
      label: 'Username',
      defaultValue: '',
      fluid: true,
      schema: userNameSchema,
    },
    password: {
      groupId: 'Password',
      label: 'Password',
      as: 'Password',
      feedback: false,
      toggleMask: true,
      fluid: true,
      messages: [
        { errorType: 'minimum' },
        { errorType: 'maximum' },
        { errorType: 'uppercase', severity: 'warn' },
        { errorType: 'lowercase', severity: 'warn' },
        { errorType: 'number', severity: 'secondary' },
      ],
      schema: passwordSchema,
    },
  }

  function getFields(keys) {
    return keys.reduce((acc, k) => {
      acc[k] = fieldsMap[k]
      return acc
    }, {})
  }

  return { fieldsMap, getFields }
}
