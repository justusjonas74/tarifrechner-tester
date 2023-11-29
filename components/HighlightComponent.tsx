import { CopyBlock , atomOneLight} from "react-code-blocks";
import { CopyBlockProps } from "react-code-blocks/dist/components/CopyBlock";

interface HighlightComponentProps {
code:string,
language:string
}

export default function HighlightComponent(props:HighlightComponentProps) {
    const copyBlockProps:CopyBlockProps = {
        text: props.code,
        language: props.language,
        showLineNumbers: true,
        // startingLineNumber: props.startingLineNumber,
        wrapLongLines: true,
        
      };

      return (
        <CopyBlock
          {...copyBlockProps}
          customStyle={{
            height: '400px',
            overflow: 'scroll',
            fontSize: '0.8rem',
          }}
          theme={atomOneLight}
        />
      );


} 
