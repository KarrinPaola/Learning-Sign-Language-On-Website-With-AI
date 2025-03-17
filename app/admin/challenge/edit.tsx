import { Edit, Datagrid, List, NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextField, TextInput } from 'react-admin';

export const ChallengeEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="question" validate={[required()]} label="Question" />
                <TextInput 
                    source="imageSrc" 
                    label="Image URL" 
                    // Không bắt buộc
                />
                <ReferenceInput
                    source='lessonId'
                    reference='lessons'
                />
                <SelectInput
                    source="type"
                    choices={[
                        { id: 'SELECT', name: 'SELECT' },
                        { id: 'ASSIST', name: 'ASSIST' },
                        { id: 'ACTION', name: 'ACTION' },
                    ]}
                    validate={[required()]}
                />
                <NumberInput
                    source='order'
                    validate={[required()]}
                    label='Order'
                />
            </SimpleForm>
        </Edit>
    )
}