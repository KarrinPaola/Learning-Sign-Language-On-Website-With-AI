
import { BooleanInput, Edit, Datagrid, List, NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextField, TextInput } from 'react-admin';

export const ChallengeOptionEdit = () => {
    return (
        <Edit>
            <SimpleForm>
            <TextInput source="text" label="Text" />
                <BooleanInput
                    source="correct"
                    label="Correct option"
                />
                <ReferenceInput
                    source='challengeId'
                    reference='challenges'
                >
                    <SelectInput
                        optionText={(record) => {
                            console.log("Challenge Record:", record);
                            return record?.question || "No question";
                        }}
                    />
                </ReferenceInput>
                <TextInput
                    source='imageSrc'
                    label='Image URL'
                />
            </SimpleForm>
        </Edit>
    )
}