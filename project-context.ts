export const PROJECT_CONTEXT = {
  // Стандартные хуки для CRUD операций
  crudHooks: {
    list: 'useCrudList',
    form: 'useCrudForm',
    required: [
      'useForm',
      'useFormContext',
      'useFieldArray',
      'useSelector',
      'useEffect',
      'useState',
      'useCallback'
    ]
  },

  // Структура CRUD компонентов
  crudStructure: {
    list: {
      required: {
        components: [
          'Loader',
          'ContentHeader',
          'CRUDTable'
        ],
        hooks: [
          'useCrudList'
        ],
        features: [
          'pagination',
          'sorting',
          'search',
          'delete'
        ]
      },
      defaultImports: [
        "import { useSelector } from 'react-redux'",
        "import { AppState } from '@/app-redux/state'",
        "import Loader from '@/components/Common/Loader'",
        "import ContentHeader from '@/components/Admin/ContentHeader'",
        "import CRUDTable from '@/components/Admin/Crud/Table'"
      ]
    },
    form: {
      required: {
        components: [
          'Loader',
          'ContentHeader',
          'CRUDNotFound',
          'FormProvider',
          'FormButtons'
        ],
        hooks: [
          'useCrudForm',
          'useForm'
        ],
        features: [
          'validation',
          'data loading',
          'error handling',
          'form submission'
        ]
      },
      defaultImports: [
        "import { useForm, FormProvider } from 'react-hook-form'",
        "import { yupResolver } from '@hookform/resolvers/yup'",
        "import { useSelector } from 'react-redux'",
        "import { AppState } from '@/app-redux/state'",
        "import Loader from '@/components/Common/Loader'",
        "import ContentHeader from '@/components/Admin/ContentHeader'",
        "import CRUDNotFound from '@/components/Admin/Crud/NotFound'",
        "import FormButtons from '@/components/Common/FormComponents/FormButtons'"
      ]
    }
  },

  // Стандартные пропсы компонентов
  componentProps: {
    ContentHeader: {
      id: 'string | undefined',
      needBackLink: 'boolean',
      modelName: 'string',
      urlSlug: 'string',
      breadcrumbs: 'Array<{url: string | false, text: string}>'
    },
    Loader: {
      isLoading: 'boolean'
    },
    CRUDNotFound: {
      loading: 'boolean',
      data: 'any',
      id: 'string | number'
    },
    FormButtons: {
      cancelUrl: 'string'
    }
  },

  // Стандартные интерфейсы
  interfaces: {
    baseFormValues: `
interface FormValues {
  id: number;
  non_field_error: string;
  [key: string]: any;
}`,
    baseProps: `
interface Props {
  id?: string | number;
}`
  },

  // Стандартные функции для работы с формами
  formHelpers: {
    validation: 'yupResolver',
    errorHandling: 'showTabWithErrors',
    dataTransform: 'enumToSelectList'
  },

  // Redux интеграция
  reduxIntegration: {
    required: [
      'actions',
      'model',
      'relations',
      'reducer'
    ],
    standardActions: [
      'get',
      'create',
      'update',
      'delete',
      'clearData',
      'clearList'
    ]
  }
};