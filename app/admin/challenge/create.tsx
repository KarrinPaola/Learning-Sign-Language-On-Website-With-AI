import { Create, NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextInput } from 'react-admin';
import { useWatch } from 'react-hook-form';

export const ChallengeCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="question" validate={[required()]} label="Question" />
                <ReferenceInput source='lessonId' reference='lessons' />
                <TypeDependentFields />
                <NumberInput source='order' validate={[required()]} label='Order' />
            </SimpleForm>
        </Create>
    );
};

const TypeDependentFields = () => {
    const type = useWatch({ name: "type" });

    return (
        <>
            <SelectInput
                source="type"
                choices={[
                    { id: 'SELECT', name: 'SELECT' },
                    { id: 'ASSIST', name: 'ASSIST' },
                    { id: 'ACTION', name: 'ACTION' },
                ]}
                validate={[required()]}
            />
            {type === 'ACTION' && (
                <TextInput
                    source="expectedActionResult"
                    label="Expected Action Result (e.g., 'A')"
                    validate={[required()]}
                />
            )}
        </>
    );
};